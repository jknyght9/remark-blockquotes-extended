import { u } from 'unist-builder';
import { visit, SKIP } from 'unist-util-visit';
import { extendedNames } from './config.js';

/**
 * Plugin to add extended blockquote formatting
 *
 * @type {import('unified').Plugin<void[], Root>}
 */
export default function remarkBlockquoteExtended() {
    return (tree, file) => {
        visit(tree, 'paragraph', (node, index, parent) => {
            const { children = [] } = node;
            const { position = {} } = node;
            const [{ value, type }, ...siblings] = children;

            const result = Object.entries(extendedNames).find(([,regex]) => regex.test(value));
            if (!result) return;

            const newChild = {
                type,
                value: formatValues(value, result[1])
            }

            const props = {
                data: {
                    class: result[0],
                    hProperties: {
                        class: result[0]
                    }
                }
            };
            parent.children.splice(index, 1, u('blockquote', props, [u('paragraph', [newChild, ...siblings])]));
            return [SKIP, index]
        });
    }
}

const formatValues = (value, regEx) => {
    if (value && value.includes("\n")) {
        return value.split('\n').map(val => {
            if (val.length === 2)
                return val.concat(' ').replace(regEx, '');
            return val.replace(regEx, '').trim();
        }).join('\n');
    }
    else
        return value.replace(regEx, '').trim();
}