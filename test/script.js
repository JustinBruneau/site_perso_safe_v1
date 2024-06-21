document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            alert(`${button.textContent} a été cliqué !`);
        });
    });
});
