import express from 'express';
export interface TypedRequest<T> extends express.Request {
  body: T;
}
