/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { isNil } from '@/util';
import { globalTypeMap } from '../GlobalTypeMap';
import { ClassClassDecorator } from '../type';
import { DecoratorMetadataObjectForRF, getClassName, getClassStath, hasClassStash } from './util';
import { EGStructLike } from '@/core/component';

export function egclass<Class extends new (...args: any[]) => any>(name?: string): ClassClassDecorator<Class> {
  return (target: Class, context: ClassDecoratorContext<Class>) => {
    globalTypeMap.set(name || getClassName(target), target);

    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const typeName = name || getClassName(target);
    metadata.CLASS_NAME_KEY = typeName;

    target.prototype.toJsonObject = function () {
      const toJson = (ctor: new () => unknown | (new () => unknown)[], thisObj: any) => {
        const obj: Record<string, any> = {};
        const stash = getClassStath(ctor);
        for (const key in stash) {
          const metaProp = stash[key];
          if (isNil(metaProp)) {
            continue;
          }

          const ctor = metaProp.type;

          if (isNil(ctor)) {
            console.log('propstash has no type, will be serialized as plain object.');
            const prop = metaProp.get?.(thisObj);
            obj[key] = prop;
            continue;
          }

          if (EGStructLike === ctor) {
            const prop = metaProp.get?.(thisObj);
            obj[key] = prop;
            continue;
          }

          // is base type
          if (ctor === Number || ctor === Boolean || ctor === String) {
            const prop = metaProp.get?.(thisObj);
            obj[key] = prop;
            continue;
          }

          // TODO: entity/component reference
          // if (ctor instanceof Entity || ctor instanceof ComponentBase) {
          // }

          const prop = metaProp.get?.(thisObj);

          if (Array.isArray(ctor)) {
            const res = [];
            for (const c of ctor) {
              res.push(toJson(c, prop));
            }
            obj[key] = res;
          } else {
            const o = toJson(ctor, prop);
            obj[key] = o;
          }
        }

        return obj;
      };

      return toJson(target, this);
    };

    target.prototype.fromJsonObject = function (json: Record<string, any>) {
      const constructFromCtors = (
        ctor: (new () => unknown) | (new () => unknown)[],
        json: Record<string, any>,
        thisObj: any
      ) => {
        const constructFromCtor = (ctor: new () => unknown, json: Record<string, any>, thisObj: any) => {
          const stash = getClassStath(ctor);
          for (const key in stash) {
            const metaProp = stash[key];
            if (!(key in json)) {
              if (metaProp?.allowEmpty) {
                return undefined;
              }
            }

            if (isNil(metaProp)) {
              return undefined;
            }

            const ctor = metaProp.type;

            if (isNil(ctor)) {
              console.log('propstash has no type, will be assigned as plain object.');
              metaProp.set?.(thisObj, json[key]);
              continue;
            }

            if (EGStructLike === ctor) {
              metaProp.set?.(thisObj, json[key]);
              continue;
            }

            // is base type
            if (ctor === Number || ctor === Boolean || ctor === String) {
              metaProp.set?.(thisObj, json[key]);
              continue;
            }

            if (Array.isArray(ctor)) {
              const obj = constructFromCtors(ctor, json[key], thisObj[key]);
              metaProp.set?.(thisObj, obj);
            } else {
              const ok = hasClassStash(ctor);
              if (!ok) {
                // prop has no record in metaclass, will be treated as plain object.
                metaProp.set?.(thisObj, json[key]);
                continue;
              }

              if (metaProp.type) {
                const obj = constructFromCtors(metaProp.type, json[key], thisObj[key]);
                metaProp.set?.(thisObj, obj);
              }
            }
          }

          return this;
        };

        if (Array.isArray(ctor)) {
          const arr: any[] = [];
          for (const c of ctor) {
            const obj = constructFromCtor(c, json, thisObj);
            arr.push(obj);
          }
          return arr;
        } else {
          return constructFromCtor(ctor, json, thisObj);
        }
      };

      constructFromCtors(target, json, this);
      return this;
    };
  };
}
