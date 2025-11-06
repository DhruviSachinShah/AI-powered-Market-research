// Create database and initial collections
db = db.getSiblingDB('market_research');

// Create collections with validation
db.createCollection('interviews', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['respondentName', 'respondentEmail', 'status'],
      properties: {
        respondentName: { bsonType: 'string' },
        respondentEmail: { bsonType: 'string' },
        status: { enum: ['in-progress', 'completed', 'abandoned'] }
      }
    }
  }
});

db.createCollection('interviewtemplates');

// Create indexes
db.interviews.createIndex({ respondentEmail: 1 });
db.interviews.createIndex({ status: 1 });
db.interviews.createIndex({ createdAt: -1 });

// Insert sample interview template
db.interviewtemplates.insertOne({
  title: 'Coffee Preferences Study',
  description: 'Understanding consumer preferences for coffee products',
  targetAudience: 'Coffee drinkers aged 18-45',
  questions: [
    {
      id: 'q1',
      text: 'How often do you drink coffee?',
      order: 1,
      expectedThemes: ['frequency', 'daily routine', 'habits'],
      expectedSentiment: 'neutral',
      probingStrategy: 'depth'
    },
    {
      id: 'q2',
      text: 'What factors influence your choice of coffee brand?',
      order: 2,
      expectedThemes: ['price', 'quality', 'taste', 'brand loyalty'],
      expectedSentiment: 'positive',
      probingStrategy: 'example'
    },
    {
      id: 'q3',
      text: 'Describe your ideal coffee experience.',
      order: 3,
      expectedThemes: ['ambiance', 'quality', 'service', 'convenience'],
      expectedSentiment: 'positive',
      probingStrategy: 'clarification'
    }
  ],
  systemPrompt: 'You are conducting a professional market research interview about coffee preferences.',
  createdAt: new Date()
});

print('Database initialized successfully!');
