import fs  from 'fs';
import Ajv from 'ajv';

export interface ConfigParams {
    port: number,
    database_url : string,
    jwt_secret : string,
}

const configSchema = {
    type: 'object',
    required: [
        "database_url",
        "port",
        "jwt_secret",
    ]
}

export function getConfig() : ConfigParams  {

    const fileName = __dirname + "/config.json";

    let configData : ConfigParams;

    try {
        if (fs.existsSync(fileName)) {
            const configFileContent = fs.readFileSync(fileName);
            configData = JSON.parse(configFileContent.toString());
        } else {
            configData = {
                database_url: process.env.DATABASE_URL || '',
                port: parseInt(process.env.PORT || '5000'),
                jwt_secret: process.env.JWT_SECRET || '',

            }
        }

        const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        const validate = ajv.compile(configSchema);

        const valid = validate(configData);
        if (!valid) {
            console.log(validate.errors);
            process.abort()
        }
    } catch (e) {
        console.log("Cant process configuration data", e)
        process.exit(1)
    }

    return configData

}

export const config = getConfig()
