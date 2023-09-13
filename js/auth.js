
var authenticator = (function(authenticator){
    
    function attempt(id,password){
        // attempt to log user in
        let user = JSON.parse(localStorage.getItem(id));
        if(user && user.password === password){
            return user;
        }else{
            return null;
        }
    }

    authenticator.init = function () {
            let session_user = sessionStorage.getItem('session_user');

            return{
                login: function(user){
                    if (this.guest()) {
                        // verify credentials
                        let auth_user = attempt(user.student_id,user.password);
                        if (auth_user) {
                            // credentials valid
                            auth_user = JSON.stringify(auth_user);
                            sessionStorage.setItem('session_user',auth_user);
                            session_user = sessionStorage.getItem('session_user');
                            return true;
                        }else{
                            return false;
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