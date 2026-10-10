const faqList = document.querySelector(".faq-list");

faqList.addEventListener("click", (event) => {
  const question = event.target.closest(".faq-question");

  if (!question) return;

  const currentItem = question.closest(".faq-item");
  const faqItems = faqList.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    if (item !== currentItem) {
      item.classList.remove("is-open");

      const icon = item.querySelector(".faq-icon");
      icon.textContent = "+";
    }
  });

  const isOpen = currentItem.classList.toggle("is-open");

  const currentIcon = currentItem.querySelector(".faq-icon");

  currentIcon.textContent = isOpen ? "−" : "+";
});

