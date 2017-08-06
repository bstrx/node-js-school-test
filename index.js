window.addEventListener('load', function () {
    /**
     * @param mainContainerId
     * @returns {{submit: submit, validate: validate, getData: getData, setData: setData}}
     * @constructor
     */
    function TestForm(mainContainerId) {
        const allowedDomains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
        const fioId = 'fio';
        const emailId = 'email';
        const phoneId = 'phone';
        const formSelector = '#' + mainContainerId + ' #myForm';

        const fillableFields = [fioId, emailId, phoneId];
        const fieldsIdToValidator = {
            [fioId]: validateFio,
            [emailId]: validateEmail,
            [phoneId]: validatePhone
        };

        const form = document.querySelector(formSelector);
        const resultContainer = document.querySelector('#' + mainContainerId + ' #resultContainer');
        const submitButton = getFieldInputWithId('submitButton');

        form.addEventListener("submit", submitEventHandler);

        /**
         * @param e
         */
        function submitEventHandler(e) {
            e.preventDefault();
            submit();
        }

        /**
         * @param fieldId
         * @returns {Element}
         */
        function getFieldInputWithId(fieldId) {
            return document.querySelector(formSelector + ' #' + fieldId)
        }

        /**
         *
         */
        function submit() {
            fillableFields.forEach(function (fieldId) {
                getFieldInputWithId(fieldId).classList.remove("error");
            });
            let validationResult = validate();

            if (!validationResult.isValid) {
                validationResult.errorFields.forEach(function (fieldId) {
                    getFieldInputWithId(fieldId).classList.add("error");
                });
            } else {
                submitButton.disabled = true;
                resultContainer.classList.remove();

                let xhr = new XMLHttpRequest();
                xhr.open('GET', 'responses/error.json', false); //TODO Make async, take link from action
                xhr.send();
                let response = JSON.parse(xhr.response);

                switch (response.status) {
                    case "success":
                        resultContainer.innerText = "Success";
                        resultContainer.classList.add("success");
                        submitButton.disabled = false;
                        break;
                    case "error":
                        resultContainer.innerText = response.reason;
                        resultContainer.classList.add("error");
                        submitButton.disabled = false;
                        break;
                    case "progress":
                        resultContainer.innerText = '';
                        resultContainer.classList.remove();
                        setTimeout(submit, response.timeout);
                        break;
                }
            }
        }

        /**
         *
         * @returns {{isValid: boolean, errorFields: Array}}
         */
        function validate() {
            let errorFields = [];

            for (let fieldId in fieldsIdToValidator) {
                if (!fieldsIdToValidator[fieldId]()) {
                    errorFields.push(fieldId);
                }
            }

            return  {
                isValid: errorFields.length === 0,
                errorFields: errorFields
            }
        }

        /**
         *
         * @returns {boolean}
         */
        function validateFio() {
            let fio = getFieldInputWithId(fioId).value.trim();
            if (!fio) {
                return false;
            }

            let words = fio.split(" ");
            return words.length === 3;
        }

        /**
         *
         * @returns {boolean}
         */
        function validateEmail() {
            let email = getFieldInputWithId(emailId).value.trim();
            if (!email) {
                return false;
            }

            let emailMatch = email.match(/^[^@\s]+@([^@\s]+)/);
            let domain = emailMatch[1];

            return allowedDomains.includes(domain);
        }

        /**
         *
         * @returns {boolean}
         */
        function validatePhone() {
            let phone = getFieldInputWithId(phoneId).value.trim();
            if (!phone) {
                return false;
            }

            return true;
            //TODO

        }

        return {
            submit: function () {
                submit();
            },
            validate: function () {
                return validate();
            },
            getData: function () {
                let data = {};
                fillableFields.forEach(function (fieldId) {
                    data[fieldId] = getFieldInputWithId[fieldId].value;
                });

                return data;
            },
            setData: function (data) {
                fillableFields.forEach(function (fieldId) {
                    getFieldInputWithId[fieldId].value = data[fieldId];
                });
            }
        }
    }

    window.MyForm = new TestForm('test-app');
});

