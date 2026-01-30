function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    sidebar.classList.toggle("active");
    content.classList.toggle("shift");
}