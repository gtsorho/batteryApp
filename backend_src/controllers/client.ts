import { Request, Response } from 'express';
import db from '../models';
import Joi from 'joi';
import { Op } from 'sequelize';

// Define the validation schema for Client
const clientSchema = Joi.object({
    client: Joi.string().required(),
    phone: Joi.string().required(),
    location: Joi.string().allow(null),
});

export default {

    createClient: async (req: Request, res: Response) => {
        try {
            const { error } = clientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const client = await db.client.create(req.body);
            res.status(201).json(client);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getClients: async (req: Request, res: Response) => {
        try {
            const clients = await db.client.findAll({
                include: [{
                    model: db.batteryCharge,  
                }]
            });
            res.json(clients);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getClientById: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const client = await db.client.findByPk(id, {
                include: [{
                    model: db.batteryCharge,  // Include associated batteryCharge records
                }]
            });
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.json(client);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateClient: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const { error } = clientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const [updated] = await db.client.update(req.body, { where: { id } });
            if (!updated) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const updatedClient = await db.client.findByPk(id, {
                include: [{
                    model: db.batteryCharge,  // Include associated batteryCharge records
                }]
            });
            res.json(updatedClient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteClient: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const deleted = await db.client.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.json({ message: 'Client deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchClients: async (req: Request, res: Response) => {
        try {
            const searchValue = req.query.search as string;

            let queryOptions: any = {
                include: [{
                    model: db.batteryCharge,  // Include associated batteryCharge records
                }],
                where: {}
            };

            if (searchValue) {
                queryOptions.where = {
                    ...queryOptions.where,
                    [Op.or]: [
                        { client: { [Op.like]: `%${searchValue}%` } },
                        { phone: { [Op.like]: `%${searchValue}%` } },
                        { location: { [Op.like]: `%${searchValue}%` } },
                    ]
                };
            }

            const clients = await db.client.findAll(queryOptions);
            res.json(clients);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}
