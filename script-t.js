function myFunction(x) {
  x.classList.toggle("change");
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
}

let currentIndex = 0;
const testimonials = document.querySelectorAll(".testimonial");

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.remove("active");
  });
  testimonials[index].classList.add("active");
}

function changeTestimonial(direction) {
  currentIndex += direction;
  if (currentIndex >= testimonials.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = testimonials.length - 1;
  showTestimonial(currentIndex);
}

// Auto cycle every 5 seconds (optional)
setInterval(() => {
  changeTestimonial(1);
}, 5000);