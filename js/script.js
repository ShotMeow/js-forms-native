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
        'company-name': '',
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

    return errors;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Собрать данные
    const formData = new FormData(form);

    // Проверить данные
    const errors = await getErrors(formData);
    const errorsEntries = Object.entries(errors);

    // Подсветить ошибки
    errorsEntries.forEach(([key, value]) => {
        const span = form.querySelector(`[data-error-name="${key}"]`);
        span.textContent = value;
    })

    // Сфокусироваться на первом ошибочном поле
    const errorInput = errorsEntries.find(([, value]) => value.length);

    if (errorInput) {
        form.querySelector(`[name="${errorInput[0]}"]`).focus();
        return;
    }

    // Если ошибок нет, отправляем данные
    fetch(form.action, {
        method: form.method,
        body: formData
    });
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