# LxAI Premium Agency Website

## Overview
Build a single, polished scrolling marketing site for LxAI with a black-and-gray luxury aesthetic, responsive navigation, concise service and industry coverage, credibility sections, pricing guidance, FAQ, and a validated contact experience.

## Implementation
- Establish a monochrome design system in `src/styles.css` with condensed display typography, semantic colors, restrained borders/shadows, smooth scrolling, and reduced-motion-safe reveal behavior.
- Replace the placeholder home route with the full semantic page: sticky header, hero, 10-service grid, industries, four-step process, value propositions, clearly labeled sample social proof, starting-price guidance, FAQ, contact form, booking placeholder, and footer.
- Add responsive mobile navigation, smooth anchor navigation, subtle hover/reveal animation, accessible form validation, and an inline success state without requiring a backend.
- Create a compact LxAI wordmark favicon and connect it in the root document metadata.
- Add route-specific SEO metadata for an AI automation agency in Kosovo, social metadata, canonical URL, and organization structured data.

## Technical Notes
- Keep this as one intentional long-form landing page because the requested structure is explicitly section-based and smooth-scrolling.
- Use only semantic Tailwind tokens and monochrome values defined centrally; no stock imagery or decorative AI clichés.
- Use lightweight inline React state and IntersectionObserver behavior; no backend or new runtime dependencies.
- Validate the finished page at desktop and mobile sizes, including menu, FAQ, contact validation, and success flow.
