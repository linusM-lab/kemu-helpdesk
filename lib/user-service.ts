// User service to centralize all user management operations

export interface User {
  id: number
  name: string
  email: string
  registrationNumber?: string
  role: "student" | "staff" | "admin" | "superadmin"
  department: string
  active: boolean
  dateCreated: string
  password?: string // I
}

class UserService {
  private static instance: UserService
  private users: User[] = []
  private initialized = false

  private constructor() {
    this.loadUsers()
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  private loadUsers(): void {
    if (typeof window === "undefined" || this.initialized) return

    try {
      // Load users from localStorage
      const savedUsers = localStorage.getItem("kemuUsers")

      if (savedUsers) {
        this.users = JSON.parse(savedUsers)
        console.log("Users loaded from localStorage:", this.users)
      } else {
        // Initialize with default superadmin if no users exist
        this.users = [
          {
            id: 1,
            name: "Linus Muriuki",
            email: "linus.muriuki@kemu.ac.ke",
            registrationNumber: "",
            role: "superadmin",
            department: "Administration",
            active: true,
            dateCreated: new Date().toISOString().split("T")[0],
            password: "root", // In a real app, this would be hashed
          },
        ]
        this.saveUsers()
      }

      this.initialized = true
    } catch (error) {
      console.error("Error loading users:", error)
      // Initialize with default superadmin if there's an error
      this.users = [
        {
          id: 1,
          name: "Linus Muriuki",
          email: "linus.muriuki@kemu.ac.ke",
          registrationNumber: "",
          role: "superadmin",
          department: "Administration",
          active: true,
          dateCreated: new Date().toISOString().split("T")[0],
          password: "root", // In a real app, this would be hashed
        },
      ]
      this.saveUsers()
      this.initialized = true
    }
  }

  private saveUsers(): void {
    if (typeof window === "undefined") return

    try {
      // Remove password field before saving to localStorage for security
      const usersToSave = this.users.map((user) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })

      localStorage.setItem("kemuUsers", JSON.stringify(usersToSave))
      console.log("Users saved to localStorage:", usersToSave)
    } catch (error) {
      console.error("Error saving users to localStorage:", error)
    }
  }

  public getUsers(): User[] {
    this.loadUsers() // Ensure users are loaded
    return this.users
  }

  public getUserById(id: number): User | undefined {
    this.loadUsers() // Ensure users are loaded
    return this.users.find((user) => user.id === id)
  }

  public getUserByEmail(email: string): User | undefined {
    this.loadUsers() // Ensure users are loaded
    return this.users.find((user) => user.email === email)
  }

  public getUserByRegistrationNumber(regNo: string): User | undefined {
    this.loadUsers() // Ensure users are loaded
    return this.users.find((user) => user.registrationNumber === regNo)
  }

  public addUser(user: Omit<User, "id" | "dateCreated">): User {
    this.loadUsers() // Ensure users are loaded

    // Check if user with this email already exists
    if (this.users.some((u) => u.email === user.email)) {
      throw new Error("A user with this email already exists")
    }

    // Check if user with this registration number already exists (if provided)
    if (user.registrationNumber && this.users.some((u) => u.registrationNumber === user.registrationNumber)) {
      throw new Error("A user with this registration number already exists")
    }

    // Find the highest ID
    const maxId = this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) : 0

    const newUser: User = {
      ...user,
      id: maxId + 1,
      dateCreated: new Date().toISOString().split("T")[0],
    }

    this.users.push(newUser)
    this.saveUsers()

    return newUser
  }

  public updateUser(id: number, updates: Partial<User>): User {
    this.loadUsers() // Ensure users are loaded

    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }

    // Check if email is being updated and if it already exists
    if (updates.email && updates.email !== this.users[index].email) {
      if (this.users.some((u) => u.email === updates.email)) {
        throw new Error("A user with this email already exists")
      }
    }

    // Check if registration number is being updated and if it already exists
    if (updates.registrationNumber && updates.registrationNumber !== this.users[index].registrationNumber) {
      if (this.users.some((u) => u.registrationNumber === updates.registrationNumber)) {
        throw new Error("A user with this registration number already exists")
      }
    }

    this.users[index] = {
      ...this.users[index],
      ...updates,
    }

    this.saveUsers()
    return this.users[index]
  }

  public deleteUser(id: number): void {
    this.loadUsers() // Ensure users are loaded

    // Check if this is the only superadmin
    const user = this.users.find((u) => u.id === id)
    if (user?.role === "superadmin") {
      const superadminCount = this.users.filter((u) => u.role === "superadmin").length
      if (superadminCount <= 1) {
        throw new Error("Cannot delete the only superadmin account")
      }
    }

    this.users = this.users.filter((user) => user.id !== id)
    this.saveUsers()
  }

  public authenticateUser(identifier: string, password: string): User | null {
    this.loadUsers() // Ensure users are loaded

    // Check if identifier is an email or registration number
    const user = this.users.find((u) => u.email === identifier || u.registrationNumber === identifier)

    if (!user) return null

    // In a real app, you would hash the password and compare the hashes
    // For the superadmin, we'll do a direct check
    if (user.email === "linus.muriuki@kemu.ac.ke" && password === "root") {
      return user
    }

    // For other users, we'll check if the password is at least 4 characters
    // This is just for demo purposes - in a real app, you'd verify the password hash
    if (password.length >= 4) {
      return user
    }

    return null
  }
}

export const userService = UserService.getInstance()

