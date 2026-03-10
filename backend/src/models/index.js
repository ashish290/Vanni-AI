import sequelize from "../config/database.js";

// Import all model factory functions
import UserModel from "./User.js";
import ConversationModel from "./Conversation.js";
import MessageModel from "./Message.js";
import MistakeModel from "./Mistake.js";
import LearnedWordModel from "./LearnedWord.js";
import GrammarTopicModel from "./GrammarTopic.js";
import UserWeakAreaModel from "./UserWeakArea.js";
import PlanModel from "./Plan.js";
import UpgradeModel from "./Upgrade.js";
import QuizModel from "./Quiz.js";
import QuizSessionModel from "./QuizSession.js";
import RoadmapProgressModel from "./RoadmapProgress.js";
import PaymentModel from "./Payment.js";
import PasswordResetModel from "./PasswordReset.js";

// Initialize models
const User = UserModel(sequelize);
const Conversation = ConversationModel(sequelize);
const Message = MessageModel(sequelize);
const Mistake = MistakeModel(sequelize);
const LearnedWord = LearnedWordModel(sequelize);
const GrammarTopic = GrammarTopicModel(sequelize);
const UserWeakArea = UserWeakAreaModel(sequelize);
const Plan = PlanModel(sequelize);
const Upgrade = UpgradeModel(sequelize);
const Quiz = QuizModel(sequelize);
const QuizSession = QuizSessionModel(sequelize);
const RoadmapProgress = RoadmapProgressModel(sequelize);
const Payment = PaymentModel(sequelize);
const PasswordReset = PasswordResetModel(sequelize);

const models = {
  User,
  Conversation,
  Message,
  Mistake,
  LearnedWord,
  GrammarTopic,
  UserWeakArea,
  Plan,
  Upgrade,
  Quiz,
  QuizSession,
  RoadmapProgress,
  Payment,
  PasswordReset,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const seedPlans = async () => {
  const plans = [
    {
      name: "free",
      dailyLimit: 20,
      voiceEnabled: false,
      historyDays: 7,
      priceMonthly: 0,
    },
    {
      name: "basic",
      dailyLimit: 100,
      voiceEnabled: true,
      historyDays: 30,
      priceMonthly: 149,
    },
    {
      name: "pro",
      dailyLimit: null,
      voiceEnabled: true,
      historyDays: null,
      priceMonthly: 299,
    },
  ];

  for (const plan of plans) {
    await Plan.upsert(plan);
  }
};

export {
  sequelize,
  User,
  Conversation,
  Message,
  Mistake,
  LearnedWord,
  GrammarTopic,
  UserWeakArea,
  Plan,
  Upgrade,
  Quiz,
  QuizSession,
  RoadmapProgress,
  Payment,
  PasswordReset,
  seedPlans,
};
