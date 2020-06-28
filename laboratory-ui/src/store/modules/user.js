import { login, persons } from '../../api/login';

const user = {
    actions: {
        Login({commit}, userInfo){
            const username = userInfo.username.trim();
            const password = userInfo.password;

            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    localStorage.setItem('ms_username', res.role.userId);
                    localStorage.setItem('roles', res.role.roleId);
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        Persons({commit}, userInfo){
            const username = userInfo.username.trim();
            const password = userInfo.password;

            return new Promise((resolve, reject) => {
                persons(username, password).then(res => {
                    localStorage.setItem('ms_username', res.person);
                    resolve();
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user
