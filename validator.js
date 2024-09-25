//Doi tuong Validator
function Validator(options){

    var selectorRules = {};
    //hAM THUC HIEN VALIDATE
    function validate(inputElement, rule){
        //Tra ve trang trai cua ham test
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector('.form_message');

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule và kiểm tra
        //Nếu có lỗi dừng việc kiểm tra
        for (var i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    //Lấy element của form validate
    var formElement = document.querySelector(options.form)
    if(formElement){

        //Default button submit
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;
            

            //Lap qua tung rule va validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
               var isValid = validate(inputElement, rule);
               if(!isValid){
                    isFormValid = false;
               }
            });

            
            console.log(formValues);

            if(isFormValid){
                //select tất cả các fied có attribute là name và không có attribite là disable
                if(typeof options.onSubmit === 'function'){
                    var EnableInput = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(EnableInput).reduce(function(values, input){
                    return (values[input.name] = input.value) && values;
                }, {});
                options.onSubmit(formValues);
                
                }
            }
        }
        //Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input)
        options.rules.forEach(function(rule){

            //Luu lai cac rule cho moi input
            //selectorRules[rule.selector] = rule.test;
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            
            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement){
                inputElement.onblur = function(){
                    // value: inputElement.value
                    //test func: rule.test
                    validate(inputElement, rule);
                    inputElement.oninput = function(){
                        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    }
                    
               
                }

                //Xử lý mỗi khi người dùng nhập vào input
            }
        });

        console.log(selectorRules)
    }

}

// Dinh nghia cac rules(luat)
// Nguyên tắc của các rules:
//1. Khi có lỗi => Trả ra message lỗi
//2. Khi hợp lệ: Không trả ra gì (underfined)

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value){
            //loại bỏ dấu cách của value, nếu có trả về underfinded nếu không trả về thông điệp
            return value.trim() ? undefined : message || 'Vui lòng nhập thông tin trường này!'
        }
    };
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Nhập không đúng định dạng, nhập lại!"

        }
    };
}

Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ky tự`

        }
    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}