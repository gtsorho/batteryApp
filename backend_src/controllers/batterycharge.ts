import { Request, Response } from 'express';
import db from '../models';
import Joi from 'joi';
import { Op } from 'sequelize';

// Define the validation schema for BatteryCharge
const batteryChargeSchema = Joi.object({
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    duration: Joi.number().required(),
    date: Joi.string().required(),
    cost: Joi.number().required(),
    initial: Joi.number().required(),
    final: Joi.number().required(),

    ClientId: Joi.number().required(),  // Include the ClientId as a foreign key
});

export default {

    createBatteryCharge: async (req: Request, res: Response) => {
        try {
            const { error } = batteryChargeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const batteryCharge = await db.batteryCharge.create(req.body);
            res.status(201).json(batteryCharge);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getBatteryCharges: async (req: Request, res: Response) => {
        try {
            const batteryCharges = await db.batteryCharge.findAll({
                include: [{
                    model: db.Client,  // Include associated Client records
                }]
            });
            res.json(batteryCharges);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getBatteryChargeById: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const batteryCharge = await db.batteryCharge.findByPk(id, {
                include: [{
                    model: db.Client,  // Include associated Client records
                }]
            });
            if (!batteryCharge) {
                return res.status(404).json({ message: 'Battery Charge not found' });
            }
            res.json(batteryCharge);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateBatteryCharge: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const { error } = batteryChargeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const [updated] = await db.batteryCharge.update(req.body, { where: { id } });
            if (!updated) {
                return res.status(404).json({ message: 'Battery Charge not found' });
            }
            const updatedBatteryCharge = await db.batteryCharge.findByPk(id, {
                include: [{
                    model: db.Client,  // Include associated Client records
                }]
            });
            res.json(updatedBatteryCharge);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteBatteryCharge: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const deleted = await db.batteryCharge.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Battery Charge not found' });
            }
            res.json({ message: 'Battery Charge deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchBatteryCharges: async (req: Request, res: Response) => {
        try {
            const searchValue = req.query.search as string;

            let queryOptions: any = {
                include: [{
                    model: db.Client,  // Include associated Client records
                }],
                where: {}
            };

            if (searchValue) {
                queryOptions.where = {
                    ...queryOptions.where,
                    [Op.or]: [
                        { startTime: { [Op.like]: `%${searchValue}%` } },
                        { endTime: { [Op.like]: `%${searchValue}%` } },
                        { duration: { [Op.like]: `%${searchValue}%` } },
                        { date: { [Op.like]: `%${searchValue}%` } },
                        { cost: { [Op.like]: `%${searchValue}%` } },
                    ]
                };
            }

            const batteryCharges = await db.batteryCharge.findAll(queryOptions);
            res.json(batteryCharges);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}
