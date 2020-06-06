// const users = [];
//add User(id,name,room)
//removeUser(id)
// getUser(id)
// getUserList(room)

class Users{
    constructor(){
        this.users = [];
        this.personalRooms = {};
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
        let usersNamesArray = users.map(user => {return {name: user.name, id: user.id}})
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
    getPersonalRoom(user1, user2){
        if(this.personalRooms[`${user1}__${user2}`]){
            return `${user1}__${user2}`;
        }else if(this.personalRooms[`${user2}__${user1}`]){
            return `${user2}__${user1}`;
        }else{
            return undefined;
        }
    }
    createPersonalRoom(user1, user2){

        let room = this.getPersonalRoom(user1, user2);
        
        if(!room){
            // Create a personal room
            this.personalRooms[`${user1}__${user2}`] = 1;
            return `${user1}__${user2}`;
        }else{
            return room;
        }
    }
}


module.exports = { Users }