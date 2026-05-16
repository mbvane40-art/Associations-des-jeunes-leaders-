import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import User from './User';

class Member extends Model {
  public id!: string;
  public userId!: string;
  public matricule!: string;
  public dateOfBirth!: Date;
  public gender!: 'M' | 'F';
  public address!: string;
  public phone!: string;
  public profession!: string;
  public photoUrl?: string;
  public idCardUrl?: string;
  public registrationDate!: Date;
  public status!: 'active' | 'inactive' | 'suspended';
  public createdAt!: Date;
  public updatedAt!: Date;
}

Member.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idCardUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'members',
    timestamps: true,
  }
);

Member.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Member, { foreignKey: 'userId', as: 'memberProfile' });

export default Member;
