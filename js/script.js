const form = document.querySelector('form');
const fileInput = document.querySelector('input[type="file"]');
const imageContainer = document.querySelector('.image-container');

const getImage = (file) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);

        image.onload = () => {
            resolve(image);
        }

        image.onerror = (error) => {
            reject(error);
        }

        image.src = url;
    })
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
})

fileInput.addEventListener('change', (event) => {
    const files = event.currentTarget.files;

    imageContainer.innerHTML = "";

    if (!files.length) {
        return
    }

    const file = files[0];

    if (file.size === 0 || !file.type.startsWith('image/')) {
        return
    }

    getImage(file)
        .then((image) => {
            imageContainer.appendChild(image);
        })
})