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

const getErrors = async (data) => {
    const errors = {
        companyName: '',
        title: '',
        description: '',
        text: '',
        image: ''
    };

    for (const [key, value] of data) {
        if (key === 'image') {
            if (value.size === 0 || !value.type.startsWith('image/')) {
                errors[key] = 'Изображение не опознано';
                continue;
            }

            await getImage(value)
                .then((image) => {
                    if (image.width < 200 || image.height < 200) {
                        errors[name] = 'Изображено должно быть минимум 200x200';

                    }
                })
            continue;
        }

        if (value.length === 0) {
            errors[key] = 'Поле не может быть пустым';
            continue;
        }

        switch (key) {
            case 'title': {
                if (value.length > 20) {
                    errors[key] = 'Название должно быть не больше 20 символов';
                }
                break;
            }

            case 'description': {
                if (value.length > 140) {
                    errors[key] = 'Подводка должна быть не больше 140 символов';
                }
                break;
            }

            case 'text': {
                if (value.length < 140) {
                    errors[key] = 'Текст должна быть не меньше 140 символов';
                }
                break;
            }

            default: {
                break;
            }
        }
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const errors = await getErrors(formData);
})

fileInput.addEventListener('change', (event) => {
    const files = event.currentTarget.files;

    imageContainer.innerHTML = "";

    if (!files.length) {
        return;
    }

    const file = files[0];

    if (file.size === 0 || !file.type.startsWith('image/')) {
        return;
    }

    getImage(file)
        .then((image) => {
            imageContainer.appendChild(image);
        })
})