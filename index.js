window.addEventListener('load', function () {
    function TestForm(mainContainerId) {
        var formId = 'myForm';
        var fioId = 'fio';
        var emailId = 'email';
        var phoneId = 'phone';
        var submitButtonId = 'submitButton';
        var resultContainerId = 'resultContainer';
        var allInputsId = [fioId, emailId, phoneId];

        var mainContainer = document.getElementById('#' + mainContainerId);
        var resultContainer = document.querySelector('#' + mainContainerId + ' #' + resultContainerId);
        var formSelector = '#' + mainContainerId + ' #' + formId;
        var form = document.querySelector(formSelector);
        var fioInput = document.querySelector(formSelector + ' #' + fioId);
        var emailInput = document.querySelector(formSelector + ' #' + emailId);
        var phoneInput = document.querySelector(formSelector + ' #' + phoneId);
        var submitButton = document.querySelector(formSelector + ' #' + submitButtonId);

        var allowedDomains =['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
        form.addEventListener("submit", submit);

        function validateFio() {
            if (!fioInput.value) {
                return false;
            }

            var words = fioInput.value.split(" ");
            return words.length === 3;
        }

        function validateEmail() {
            if (!emailInput.value) {
                return false;
            }

            console.log(emailInput.value);
            if (emailInput.value.match('/[.]+/')) { //TODO!! not working
                return true;
            }
        }

        function validatePhone() {
            if (!phoneInput.value) {
                return false;
            }

            //TODO

        }

        function setResultContainerData(data) {
            resultContainer.innerText = data;
        }

        function getResultContainerData() {
            return resultContainer.innerText;
        }

        function clearResultContainerData() {
            resultContainer.innerText = '';
        }

        function submit(e) {
            e.preventDefault();

            var validationResult = validate();
            if (!validationResult.isValid) {
                allInputsId.forEach(function (fieldId) {
                    document.querySelector(formSelector + ' #' + fieldId).classList.remove("error");
                });

                validationResult.errorFields.forEach(function (fieldId) {
                    var element = document.querySelector(formSelector + ' #' + fieldId);
                    if (!element.classList.contains("error")) {
                        element.classList.add("error");
                    }
                });
            } else {
                //send ajax TODO
            }
        }

        function validate() {
            var errorFields = [];

            if (!validateFio()) {
                errorFields.push(fioId);
            }

            if (!validateEmail()) {
                errorFields.push(emailId);
            }

            if (!validatePhone()) {
                errorFields.push(phoneId);
            }

            return  {
                isValid: errorFields.length === 0,
                errorFields: errorFields
            }
        }

        return {
            submit: function () {
                submit();
            },
            validate: function () {
                return validate();
            },
            getData: function () {

            },
            setData: function (data) {

            }
        }
    }

    window.MyForm = new TestForm('test-app');
});

