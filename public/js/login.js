// $(".input_text").focus(function () {
//     $(this).prev('.fa').addclass('glowIcon')
// })
// $(".input_text").focusout(function () {
//     $(this).prev('.fa').removeclass('glowIcon')
// })
const inputElements = document.querySelectorAll('.input_text');

// Lặp qua tất cả các phần tử input_text để gắn sự kiện focus và focusout
inputElements.forEach(inputElement => {
    // Lấy phần tử trước đó của input (đã có class 'fa') để thêm hoặc xóa class 'glowIcon'
    const previousElement = inputElement.previousElementSibling;

    // Sự kiện focus
    inputElement.addEventListener('focus', () => {
        previousElement.classList.add('glowIcon');
    });

    // Sự kiện focusout (blur)
    inputElement.addEventListener('focusout', () => {
        previousElement.classList.remove('glowIcon');
    });
});






