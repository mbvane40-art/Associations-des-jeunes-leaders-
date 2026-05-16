import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import Member from './Member';

class Subscription extends Model {
  public id!: string;
  public memberId!: string;
  public amount!: number;
  public currency!: string;
  public month!: number;
  public year!: number;
  public status!: 'pending' | 'paid' | 'failed';
  public paymentMethod!: string;
  public receiptNumber?: string;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Member,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'mtn', 'airtel', 'paypal', 'card'),
      allowNull: false,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    timestamps: true,
  }
);

Subscription.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Member.hasMany(Subscription, { foreignKey: 'memberId', as: 'subscriptions' });

export default Subscription;
