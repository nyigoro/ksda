## Image Optimization Best Practices

For optimal performance, especially when adding album art or other visual assets, consider the following image optimization techniques:

*   **Compression:** Use tools like TinyPNG, ImageOptim, or online compressors to reduce file size without significant loss of quality.
*   **Responsive Images:** Use `srcset` and `sizes` attributes with the `<picture>` element to serve different image sizes based on the user's device and screen resolution.
*   **Modern Formats:** Prefer modern image formats like WebP or AVIF over JPEG or PNG where browser support allows, as they offer better compression.
*   **Lazy Loading:** Implement lazy loading for images that are not immediately visible on page load (e.g., images below the fold) to prioritize critical content.
*   **CDN (Content Delivery Network):** For production environments, consider using a CDN to serve images, which can significantly improve delivery speed by serving content from servers geographically closer to your users.