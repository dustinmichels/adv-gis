// Copy code button functionality
document.addEventListener("DOMContentLoaded", function () {
  // Add copy buttons to all code blocks
  const codeBlocks = document.querySelectorAll("pre code");

  codeBlocks.forEach(function (codeBlock) {
    const pre = codeBlock.parentNode;

    // Create copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "code-copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.setAttribute("aria-label", "Copy code to clipboard");

    // Add click event
    copyBtn.addEventListener("click", function () {
      // Get the code text
      const codeText = codeBlock.textContent || codeBlock.innerText;

      // Copy to clipboard
      navigator.clipboard
        .writeText(codeText)
        .then(function () {
          // Success feedback
          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("copied");

          // Reset button after 2 seconds
          setTimeout(function () {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 2000);
        })
        .catch(function (err) {
          // Fallback for older browsers
          console.error("Copy failed:", err);

          // Try legacy method
          const textArea = document.createElement("textarea");
          textArea.value = codeText;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            document.execCommand("copy");
            copyBtn.textContent = "Copied!";
            copyBtn.classList.add("copied");

            setTimeout(function () {
              copyBtn.textContent = "Copy";
              copyBtn.classList.remove("copied");
            }, 2000);
          } catch (fallbackErr) {
            console.error("Fallback copy failed:", fallbackErr);
            copyBtn.textContent = "Copy failed";

            setTimeout(function () {
              copyBtn.textContent = "Copy";
            }, 2000);
          }

          document.body.removeChild(textArea);
        });
    });

    // Add button to pre element
    pre.appendChild(copyBtn);
  });
});
