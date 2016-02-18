import {Pipe} from "angular2/core";

/**
 * A simple string filter, since ng2 does not yet have a filter pipe built in.
 */
@Pipe({
    name: 'stringFilter'
})
export class StringFilterPipe {

    transform(value: string[], args: string[]) {
        let q = args[0];
        if (!q || q === '') {
            return value;
        }
        return value.filter(item => -1 < item.toLowerCase().indexOf(q.toLowerCase()));
    }
}
