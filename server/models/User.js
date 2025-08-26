const users = [];
let nextUserId = 1;

class User {
  constructor(username, email, password) {
    this.id = nextUserId++;
    this.username = username;
    this.email = email;
    this.password = password; // In a real app, this should be hashed
    this.createdAt = new Date();
    this.playlists = [];
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findByUsername(username) {
    return users.find(user => user.username === username);
  }

  static create(userData) {
    const { username, email, password } = userData;
    
    // Check if user already exists
    if (this.findByEmail(email)) {
      throw new Error('Email already in use');
    }
    
    if (this.findByUsername(username)) {
      throw new Error('Username already taken');
    }
    
    const newUser = new User(username, email, password);
    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static authenticate(email, password) {
    const user = this.findByEmail(email);
    
    if (!user || user.password !== password) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static getAll() {
    // Return users without passwords
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = User; 