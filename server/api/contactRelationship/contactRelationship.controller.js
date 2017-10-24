/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/contactRelationships              ->  index
 * POST    /api/contactRelationships              ->  create
 * GET     /api/contactRelationships/:id          ->  show
 * PUT     /api/contactRelationships/:id          ->  upsert
 * PATCH   /api/contactRelationships/:id          ->  patch
 * DELETE  /api/contactRelationships/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import ContactRelationship from './contactRelationship.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of ContactRelationships
export function index(req, res) {
  return ContactRelationship.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ContactRelationship from the DB
export function show(req, res) {
  return ContactRelationship.find({ connection: {$eq: req.params.id}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ContactRelationship in the DB
export function create(req, res) {
  return ContactRelationship.insertMany(req.body.data)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ContactRelationship in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ContactRelationship.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ContactRelationship in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ContactRelationship.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ContactRelationship from the DB
export function destroy(req, res) {
  return ContactRelationship.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
