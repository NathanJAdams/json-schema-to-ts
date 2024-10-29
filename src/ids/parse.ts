import { SchemaId } from './schema-ids';
import { SchemaRef } from './schema-refs';

type SchemaPath = {
  folder: string;
  name: string;
};

const parseAuthority = (url: string): string | undefined => {
  const protocolMatch = url.match(/^([^:/]+:\/\/)/);
  if (!protocolMatch) {
    return;
  }
  const protocol = protocolMatch[1];
  const withoutProtocol = url.substring(protocol.length);
  const endpointStartMatch = withoutProtocol.match(/^[^/#]+([/#].*)/);
  const endpoint = endpointStartMatch ? endpointStartMatch[1] : undefined;
  const authority = endpoint
    ? url.substring(0, url.length - endpoint.length)
    : url;
  return authority;
};

const parsePath = (endpoint: string): SchemaPath | undefined => {
  const pathMatch = endpoint.match(/^\/([^#]+)/);
  if (!pathMatch) {
    return;
  }
  const match = pathMatch[1];
  const lastSlashIndex = match.lastIndexOf('/');
  const folder = lastSlashIndex <= 0
    ? '.'
    : match.substring(0, lastSlashIndex);
  const name =
    lastSlashIndex === -1
      ? match
      : match.substring(lastSlashIndex + 1);
  return {
    folder,
    name,
  };
};

const parseFragment = (url: string): string | undefined => {
  const pathMatch = url.match(/^[^#]*#\/?(?:(?:\$defs|definitions)\/)?(.*)$/);
  if (!pathMatch) {
    return;
  }
  return pathMatch[1];
};

export const parseSchemaId = (id?: string): SchemaId | undefined => {
  if (!id) {
    return;
  }
  const authority = parseAuthority(id);
  if (authority === undefined && !id.startsWith('/')) {
    return;
  }
  const endpoint = authority === undefined
    ? id
    : id.substring(authority.length);
  const path = parsePath(endpoint);
  if (!path) {
    return;
  }
  return {
    authority,
    folder: path.folder,
    name: path.name,
  };
};

export const parseSchemaRef = (ref?: string): SchemaRef | undefined => {
  if (!ref) {
    return;
  }
  const authority = parseAuthority(ref);
  const endpoint = authority === undefined
    ? ref
    : ref.substring(authority.length);
  const path = parsePath(endpoint);
  const fragment = parseFragment(ref);
  if (!path) {
    return fragment
      ? { fragment }
      : undefined;
  }
  return {
    authority,
    folder: path.folder,
    name: path.name,
    fragment,
  };
};
