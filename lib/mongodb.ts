import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-finance-visualizer-dummy';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// For development, we'll use a simple in-memory fallback if MongoDB is not available
let inMemoryStorage: any[] = [];
let inMemoryId = 0;

// Extend global to include our custom property
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  try {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage for development');
    global._mongoClientPromise = Promise.resolve(null as any);
  }
}
clientPromise = global._mongoClientPromise;

// In-memory database functions for development
const inMemoryDB = {
  find(query: any = {}) {
    let results = [...inMemoryStorage];
    
    // Simple filtering (can be extended)
    if (query._id) {
      results = results.filter(doc => doc._id === query._id);
    }
    
    return {
      sort(sortObj: any) {
        const [field, direction] = Object.entries(sortObj)[0];
        results.sort((a, b) => {
          if (direction === -1) {
            return b[field] > a[field] ? 1 : -1;
          }
          return a[field] > b[field] ? 1 : -1;
        });
        return {
          toArray() {
            return Promise.resolve(results);
          }
        };
      }
    };
  },
  insertOne(data: any) {
    const newDoc = { ...data, _id: `mem_${++inMemoryId}` };
    inMemoryStorage.push(newDoc);
    return Promise.resolve({ insertedId: newDoc._id });
  },
  updateOne(query: any, update: any) {
    const index = inMemoryStorage.findIndex(doc => doc._id === query._id);
    if (index !== -1) {
      inMemoryStorage[index] = { ...inMemoryStorage[index], ...update.$set };
      return Promise.resolve({ matchedCount: 1 });
    }
    return Promise.resolve({ matchedCount: 0 });
  },
  deleteOne(query: any) {
    const index = inMemoryStorage.findIndex(doc => doc._id === query._id);
    if (index !== -1) {
      inMemoryStorage.splice(index, 1);
      return Promise.resolve({ deletedCount: 1 });
    }
    return Promise.resolve({ deletedCount: 0 });
  }
};

export default clientPromise;

// Export a function to get the database
export async function getDB() {
  try {
    const client = await clientPromise;
    if (client) {
      return client.db();
    }
  } catch (error) {
    console.warn('Using in-memory database for development');
  }
  
  // Return in-memory database
  return {
    collection: (name: string) => inMemoryDB
  };
} 