const expandedButtons = document.querySelectorAll("[data-expand-button]");
const expandableElements = document.querySelectorAll("[data-expandable]");

checkForOverflow();
expandedButtons.forEach(button => {
    button.addEventListener("click", toggleText);
 });

 function checkForOverflow() {
    expandableElements.forEach(expandableElement => {
        if (expandableElement.classList.contains("expanded")) return;
        const expandableText = expandableElement.querySelector("[data-expand-text]");
        const overflowing = expandableText.scrollHeight > expandableText.clientHeight;
        expandableElement.dataset.overflow = overflowing;
    });
}

function toggleText(event) {
    const expandableElement = event.target.closest("[data-expandable]");
    expandableElement.classList.toggle("expanded");
    setExpandButtonText(event.target);
}
    
function setExpandButtonText(button) {
    const expandableElement = button.closest("[data-expandable]");
    const expanded = expandableElement.classList.contains("expanded");
    button.innerText = expanded ? "Read Less" : "Read More";
}

