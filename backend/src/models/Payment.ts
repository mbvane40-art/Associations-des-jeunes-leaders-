import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import Member from './Member';

class Payment extends Model {
  public id!: string;
  public memberId!: string;
  public subscriptionId?: string;
  public amount!: number;
  public currency!: string;
  public paymentMethod!: string;
  public stripePaymentIntentId?: string;
  public status!: 'pending' | 'completed' | 'failed' | 'refunded';
  public transactionRef?: string;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Payment.init(
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
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'mtn', 'airtel', 'paypal', 'card', 'bank_transfer'),
      allowNull: false,
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    transactionRef: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  }
);

Payment.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Member.hasMany(Payment, { foreignKey: 'memberId', as: 'payments' });

export default Payment;
