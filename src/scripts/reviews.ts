import type { GoogleReviewsResponse, LivePatientReview } from "../lib/reviews";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
});

function makeLink(url: string, label: string) {
  const link = document.createElement("a");
  link.href = url;
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function createSlide(template: HTMLTemplateElement, review: LivePatientReview, id: string) {
  const slide = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const rating = slide.querySelector<HTMLElement>(".review-rating")!;
  rating.setAttribute("aria-label", `${review.rating} out of 5 stars`);
  rating.firstElementChild!.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const quote = slide.querySelector("blockquote")!;
  quote.cite = review.sourceUrl;
  const words = slide.querySelector<HTMLElement>("[data-review-text]")!;
  words.textContent = review.text;
  words.id = id;
  if (review.languageCode) words.lang = review.languageCode;
  slide.querySelector("[data-expand]")!.setAttribute("aria-controls", id);
  const author = slide.querySelector<HTMLElement>("[data-author]")!;
  if (review.authorUrl) author.append(makeLink(review.authorUrl, review.name));
  else author.textContent = review.name;
  const avatar = slide.querySelector<HTMLImageElement>("[data-avatar]")!;
  if (review.avatarUrl) {
    avatar.src = review.avatarUrl;
    avatar.hidden = false;
    avatar.addEventListener("error", () => { avatar.hidden = true; }, { once: true });
  }
  const source = slide.querySelector<HTMLAnchorElement>("[data-source]")!;
  source.href = review.sourceUrl;
  source.setAttribute("aria-label", `Read ${review.name}’s full review on Google Maps`);
  const time = slide.querySelector("time")!;
  if (review.date && Number.isFinite(Date.parse(review.date))) {
    time.dateTime = review.date;
    time.textContent = dateFormatter.format(new Date(review.date));
    time.hidden = false;
  }
  return slide;
}

export function initializeReviewCarousels() {
  document.querySelectorAll<HTMLElement>("[data-reviews-endpoint]").forEach(section => {
    const carousel = section.querySelector<HTMLElement>("[data-carousel]")!;
    const container = carousel.querySelector<HTMLElement>(".review-slides")!;
    const controls = carousel.querySelector<HTMLElement>(".carousel-controls")!;
    const counter = carousel.querySelector<HTMLElement>("[data-counter]")!;
    const template = section.querySelector<HTMLTemplateElement>("[data-live-review]")!;
    let slides = [...container.querySelectorAll<HTMLElement>("[data-slide]")];
    let active = 0;

    const show = (index: number) => {
      controls.hidden = slides.length < 2;
      if (!slides.length) return;
      if (container.contains(document.activeElement)) carousel.focus({ preventScroll: true });
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
        slide.setAttribute("aria-hidden", String(i !== active));
        slide.inert = i !== active;
        if (i !== active) {
          slide.querySelector("[data-review-text]")?.classList.add("is-collapsed");
          const expand = slide.querySelector<HTMLButtonElement>("[data-expand]");
          if (expand) { expand.setAttribute("aria-expanded", "false"); expand.textContent = "Read More"; }
        }
      });
      counter.textContent = `${active + 1} / ${slides.length}`;
    };
    show(0);
    carousel.querySelector("[data-previous]")?.addEventListener("click", () => show(active - 1));
    carousel.querySelector("[data-next]")?.addEventListener("click", () => show(active + 1));
    carousel.addEventListener("keydown", event => {
      if (event.target instanceof Element && event.target.closest("a")) return;
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "Home") show(0);
        else if (event.key === "End") show(slides.length - 1);
        else show(active + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });

    const applyReviews = (body: GoogleReviewsResponse) => {
      // Do not remove a link or disclosure while the visitor is focused on it.
      if (container.contains(document.activeElement)) {
        container.addEventListener("focusout", () => queueMicrotask(() => applyReviews(body)), { once: true });
        return;
      }
      const newSlides = body.reviews.map((review, index) => createSlide(template, review, `${section.id}-text-${index}`));
      container.replaceChildren(...newSlides);
      slides = newSlides;
      carousel.hidden = false;
      section.querySelector(".reviews-grid")?.classList.remove("reviews-empty");
      show(0);
      section.dataset.reviewState = "live";
      carousel.querySelector<HTMLElement>("[data-live-attribution]")!.hidden = false;
      carousel.querySelector<HTMLElement>("[data-fallback-note]")!.hidden = true;
      const providers = carousel.querySelector<HTMLElement>("[data-provider-attributions]")!;
      for (const provider of body.attributions) {
        if (providers.childNodes.length) providers.append(" · ");
        providers.append(provider.uri ? makeLink(provider.uri, provider.name) : document.createTextNode(provider.name));
      }
      providers.hidden = !providers.childNodes.length;
      // Keep long reviews compact, with the full original text available inline.
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          const words = entry.target as HTMLElement;
          const button = words.closest("article")!.querySelector<HTMLButtonElement>("[data-expand]")!;
          button.hidden = button.getAttribute("aria-expanded") !== "true" && words.scrollHeight <= words.clientHeight + 1;
        }
      });
      for (const slide of slides) {
        const words = slide.querySelector<HTMLElement>("[data-review-text]")!;
        const button = slide.querySelector<HTMLButtonElement>("[data-expand]")!;
        observer.observe(words);
        button.addEventListener("click", () => {
          const expanded = button.getAttribute("aria-expanded") !== "true";
          button.setAttribute("aria-expanded", String(expanded));
          button.textContent = expanded ? "Show Less" : "Read More";
          words.classList.toggle("is-collapsed", !expanded);
          if (!expanded) button.scrollIntoView({ block: "nearest", behavior: "instant" });
        });
      }
    };

    const load = async () => {
      section.dataset.reviewState = "loading";
      try {
        const result = await fetch(section.dataset.reviewsEndpoint!, {
          cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(9000),
        });
        if (!result.ok || !result.headers.get("content-type")?.includes("application/json")) throw new Error("Unavailable");
        const body: GoogleReviewsResponse = await result.json();
        if (!Array.isArray(body.reviews) || !body.reviews.length || !Array.isArray(body.attributions)) throw new Error("No reviews");
        applyReviews(body);
      } catch {
        // The original excerpts remain usable, including when JavaScript or the
        // API is unavailable. No retries, storage, or background refresh loop.
        section.dataset.reviewState = "fallback";
      }
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        void load();
      }, { rootMargin: "300px" });
      observer.observe(section);
    } else void load();
  });
}
