
// This object is responsible for storing/updating DATA
var model = {

    // save new registration to local storage(db) - TODO
    save: function(user){},

    // retrieve a list of users from local storage(db) - TODO
    getUsers: function () {}
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

            view.init(url);
        } else {
            console.log('continue user');

            const user = auth.getAuthUser();
            view.render(url,user);
        }
    },

    // register a new user - TODO
    registerUser: function () {},

    // validate form - TODO
    validate: function () {},

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
    init: function (url) {
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

            document.getElementById('register_form').addEventListener('submit',function (e) {
                e.preventDefault();

                // TODO - handle register form submitted
                // get form data
                // call controller action

                console.log('register form submitted');
            });
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

    // Display errors - TODO
    displayError(){}

}

// START APPLICATION
document.addEventListener('DOMContentLoaded',function () {
    controller.initApp();
});

// TESTING
var test = {
        login:function () {
            const auth = authenticator.init();
    
            // TEST CAN LOG USER IN
            auth.login({firstname:'irakoze',lastname:'maurice'});
            controller.redirect('dashboard.html');
    
            // TEST CAN LOG USER OUT
            // auth.logout();
        },
}