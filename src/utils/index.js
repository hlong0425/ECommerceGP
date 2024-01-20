import _ from 'lodash';
import { Types } from 'mongoose';

const toObjectId = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(s => [s, 1]));
};

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(s => [s, 0]));
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if (!obj[k]) {
            delete obj[k];
        }
    })
}

const convertToMongoObjectIdMongodb = id => Types.ObjectId(id);

/// Cách 1:

// const updateNestedObjectParser = (obj = {}) => {
//     const final = {};
//     Object.keys(obj).forEach(key => {
//         if (typeof obj[key] === 'object' && !Array.isArray(obj[key])){
//             const response = updateNestesdObjectParser(obj[key]);
//             Object.keys(response).forEach(a => {
//                 final[`${key}.${a}`] = response[a];
//             })
//         }
//         else {
//             final[key] = obj[key];
//         }
//     })
//     return final;
// };

/// Cách 2:

const updateNestedObjectParser = (obj, parent, result = {}) => {
    Object.keys(obj).forEach(k => {
        const propName = parent ? `${parent}.${k}` : k
        if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
            updateNestedObjectParser(obj[k], propName, result)
        }
        else {
            result[propName] = obj[k]
        }
    })
    return result
}

export {
    getInfoData,
    getSelectData, removeUndefinedObject, toObjectId, unSelectData, updateNestedObjectParser
};

