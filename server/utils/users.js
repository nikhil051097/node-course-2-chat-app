// const users = [];
//add User(id,name,room)
//removeUser(id)
// getUser(id)
// getUserList(room)

class Users{
    constructor(){
        this.users = [];
    }
    addUser (id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id){
        let user = this.getUser(id);
        this.users = this.users.filter(user => user.id !== id);
        return user;
    }
    getUserList (room){
        let users = this.users.filter(user => user.room === room);
        let usersNamesArray = users.map(user => user.name)
        return usersNamesArray;
    }
    getUser(id){
        return this.users.filter(user => user.id === id)[0];
    }
    getRooms(){
        let rooms = {};

        this.users.forEach(user => {
          if (rooms[user.room]) {
            rooms[user.room]++;
          } else {
            rooms[user.room] = 1
          }
        });
        return rooms;
    }
}


module.exports = { Users }