import { StringArray } from '@/common/schemas/StringArray';
import { StringKeyRecord } from '@/common/schemas/StringKeyRecord';

export const StringArrayRecord = () => StringKeyRecord(StringArray());
