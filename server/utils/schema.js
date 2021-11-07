const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('name', 'autre parametre')
    .with('password', 'repeat_password');

schema.validate({ name: 'abc', birth_year: 1994 });
