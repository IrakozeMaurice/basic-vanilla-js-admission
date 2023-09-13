
// This object is responsible for storing/updating DATA
var model = {

    // school faculties and departments
    getPrograms: function(){
        const programs = {
            'Information Technology':['Information Management','Networks and communication system','Software Engineering'],
            'Business Administration': ['Accounting','Finance','Marketing','Management'],
            'Education': ['English','Mathematics','French','Geography']
        };
        return programs;
    },

    // save new registration to local storage(db)
    save: function(user){
        
        // check if user id exists
        let userExists = false;
        if (localStorage.length) {
            for (const [key,value] of Object.entries(localStorage)) {
                if (key == user.student_id) {
                    userExists = true;break;
                }
            }
        }
        if (userExists) {
            return null;
        }else{
            delete user['confirm_password'];
            localStorage.setItem(user['student_id'],JSON.stringify(user));
            return user;
        }
    },

    // retrieve a list of users from local storage(db)
    getUsers: function () {
        const users = Object.entries(localStorage);
        return JSON.parse(JSON.stringify(users));
    }
}

// This object is responsible for connecting view and model / handling requests
var controller = {
    // kickoff the application
    initApp: function () {
        console.log('application started');

        const auth = authenticator.init();  // GET AUTH INFO

        const url = window.location.href;
        if (auth.user()) {
            // prevent logged in user from accessing guest pages
            if (url.includes('login.html') || url.includes('register.html')) {
                // TOAST ERROR - TODO
                this.redirect('dashboard.html');
                return;
            }
        }else if(auth.guest()){
            // prevent guest from accessing dashboard
            if (url.includes('dashboard.html')) {
                // TOAST ERROR - TODO
                const url = this.redirect('login.html');
                return;
            }
        }

        if (auth.guest()) {
            console.log('continue guest');

            const programs = model.getPrograms();
            view.init(url,programs);
        } else {
            console.log('continue user');

            const user = auth.getAuthUser();
            view.render(url,user);
        }
    },

    // register a new user
    registerUser: function (formData) {
        const errors = this.validate(formData);
        if (errors.length) {
            view.displayError(errors);
            return;
        }else{
            // check if user doesn't already exist
            let user = {};
            for (const [key,value] of formData) {
                user[key] = value;
            }
            const savedUser = model.save(user);
            if (savedUser) {
                const auth = authenticator.init();
                if (auth.guest()) {
                    auth.login(savedUser);
                    this.redirect('dashboard.html');
                }
            }else{
                // display error
                view.displayError(['registration_error','USER ALREADY EXISTS']);
                return;
            }
        }
    },

    // validate form - TODO
    validate: function (formData) {
        const errors = [];
        for (const [key,value] of formData) {
            if (value.length === 0) {
                errors.push([key,' is required']);
            }
        }
        return errors;
    },

    // redirect to a given url
    redirect: function (url){
        window.location.assign(url);
    },

    // log user out
    logout(){
        const auth = authenticator.init();
        if (auth.user()) {
            auth.logout();
        }
        this.redirect('index.html');
    }
}

// This object is responsible for rendering pages and listening to user requests
var view = {

    // Called when user is guest
    init: function (url,programs) {
        
        // add event listener to login and register forms
        if (url.includes('login.html')) {

            document.getElementById('login_form').addEventListener('submit',function (e) {
                e.preventDefault();

                // TODO - handle login form submitted
                // get form data
                // call controller action

                console.log('login form submitted');
                test.login();
            });
        }else if (url.includes('register.html')) {
            // add faculties to select
            this.addFaculties(programs);

            document.getElementById('register_form').addEventListener('submit',function (e) {
                e.preventDefault();

                // get form data
                const register_form = document.getElementById('register_form');
                const formData = new FormData(register_form);
                // call controller action
                controller.registerUser(formData);
            });

            // add event listener for form input fields validation
            document.getElementById('register_form').addEventListener('input',function (e) {
                e.preventDefault();

                const field = e.target.id;
                if (field === 'faculty') {
                    changeProgramList(programs);
                }else{
                    if (field !== 'department') {
                        let input = document.getElementById(field);
                        if (!validateField(field,input.value) && input.value.length) {
                            input.classList.add('invalid');
                            document.querySelector('.'+field).classList.remove('none');
                        }else{
                            input.classList.remove('invalid');
                            document.querySelector('.'+field).classList.add('none');
                        }
                    }
                }
            });

            // validate input
            function validateField(field,value) {
                if (field === 'student_id') {
                    if (!isNaN(value)) {
                        return value.length===5;
                    }
                }
                if (field === 'firstname' || field === 'lastname') {
                    if (isNaN(value)) {
                        return strlen(value,2,30);
                    }
                }
                if (field === 'address') {
                    if (isNaN(value)) {
                        return strlen(value,2,30);
                    }
                }
                if(field === 'phone_number'){
                    // 10 digit starting with 078, 079, 073 or 072
                    const regex = /07[2389][0123456789]{7}$/;
                    return matchRegex(regex,value);
                }
                if (field === 'email') {
                    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return matchRegex(regex,value);
                }
                if (field === 'password' || field === 'confirm_password') {
                    return strlen(value,6,12);
                }

                // check length of a string
                function strlen(str, min, max){
                    str = str.trim();     
                    return str.length >= min && str.length <= max;
                }
                // check regex match
                function matchRegex(regex,value) {
                    return regex.test(value);
                }
            }

            // change departments according to selected faculty
            function changeProgramList(programs) {
                var facultyList = document.getElementById("faculty");
                var departmentList = document.getElementById("department");
                var selectedFaculty = facultyList.options[facultyList.selectedIndex].value;
                while (departmentList.options.length) {
                    departmentList.remove(0);
                }
                var departments = programs[selectedFaculty];
                if (departments) {
                    var i;
                    for (i = 0; i < departments.length; i++) {
                        var department = new Option(departments[i], departments[i]);
                        departmentList.options.add(department);
                    }
                }
            }

        }else if (url.includes('index.html')) {
            
            // display auth buttons
            document.querySelector('.guest').style.display = 'flex';
        }
    },

    // Called when user is logged in
    render: function (url,user) {
        if (url.includes('index.html')) {
            
            // hide auth buttons
            document.querySelector('.auth').style.display = 'flex';
            
            // display logged in user names and link to dashboard
            document.getElementById('username').textContent = user.firstname + ' ' + user.lastname;

            // add event listener to logout button
            document.getElementById('logout_btn').addEventListener('click',function (e) {
                e.preventDefault();
                controller.logout();
            });

        }else if(url.includes('dashboard.html')){
            // display logged in user names to dashboard
            document.getElementById('username').textContent = user.firstname + ' ' + user.lastname;

            // add event listener to logout button
            document.getElementById('logout_btn').addEventListener('click',function (e) {
                e.preventDefault();
                controller.logout();
            });
        }
    },

    // Display errors - TODO - NEED FIX
    displayError: function(errors){
        if (errors[0] === 'registration_error') {
            document.getElementById('registration_error').classList.remove('none');
            document.getElementById('registration_error').textContent = errors[1];
        }else{
            const errorDiv = document.querySelector('.validationError');
            errors.forEach(error => {
                document.getElementById(error[0]).style.border = '1px solid red';
                console.log(error[0],error[1]);
                const li = document.createElement('li');
                li.textContent = `${error[0]} ${error[1]}`;
                errorDiv.appendChild(li);
            });
            errorDiv.classList.remove('none');
        }
    },

    // add faculties to select options
    addFaculties: function(programs){
        var facultyList = document.getElementById("faculty");
        if (facultyList.options.length <= 1) {
            for(let faculty of Object.keys(programs)){
                var fac = new Option(faculty, faculty);
                facultyList.options.add(fac);
            }
        }
      },
}

// START APPLICATION
document.addEventListener('DOMContentLoaded',function () {
    controller.initApp();
});

