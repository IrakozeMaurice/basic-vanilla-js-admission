
var authenticator = (function(authenticator){
    
    function attempt(email,password){
        // attempt to log user in

        if('validation pass'){
            // TODO - VALIDATE USER CREDENTIALS FROM LOCAL STORAGE
            return true;
        }else{
            return false;
        }
    }

    authenticator.init = function () {
            let session_user = sessionStorage.getItem('session_user');

            return{
                login: function(user){
                    // logs user in if is guest

                    if (this.guest()) {
                        // verify credentials
                        if (attempt(user.email,user.password)) {
                            // credentials valid
                            user = JSON.stringify(user);
                            sessionStorage.setItem('session_user',user);
                            session_user = sessionStorage.getItem('session_user');
                            return true;
                        }
                    }
                },
                logout: function(user){
                    // logs user out if is logged in
                    if (this.user()) {
                        sessionStorage.removeItem('session_user');
                        session_user = sessionStorage.getItem('session_user');
                    }
                },
                user: function(){
                    // return true if there is a logged in user
                    return session_user !== null;
                },
                guest: function(){
                    // return true if there is no logged in user
                    return session_user === null;
                },
                getAuthUser(){
                    if (session_user) {
                        return JSON.parse(session_user);
                    }
                }
            };
        }

    return authenticator;

})(authenticator || {});