import {Router} from 'express';
import v1 from './v1';
import auth from './auth';

const router = Router();

router.use('/auth', auth);
router.use('/v1', v1);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the tag.
 *           example: "vendor"
 *         name:
 *           type: string
 *           description: The display-name of the tag.
 *           example: "Vendor"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message.
 *         code:
 *           type: string
 *           description: The error code.
 *     LoginFailed:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message.
 *           example: Either the email or password is incorrect.
 *         code:
 *           type: string
 *           description: The error code.
 *           example: "auth/invalid-credentials"
 *     MissingCredentials:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message.
 *           example: "Email and password are required."
 *         code:
 *           type: string
 *           description: The error code.
 *           example: "auth/missing-credentials"
 *     ObjectNotFound:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message.
 *           example: "Object not found"
 *         code:
 *           type: string
 *           description: The error code.
 *           example: "object/not-found"
 *     BodyMissingRootObject:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message.
 *           example: "Body is missing root object"
 *         code:
 *           type: string
 *           description: The error code.
 *           example: "invalid-body/missing-root-object"
 *     BodyInvalidObject:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message.
 *           example: "Body object does not fit schema definition"
 *         code:
 *           type: string
 *           description: The error code.
 *           example: "invalid-body/invalid-object"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       in: header
 *       name: Authorization
 */