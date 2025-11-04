export const DEFAULT_SORT_BY = '_id';
export const DEFAULT_UPDATE_AT = 'updatedAt';
export const DEFAULT_SORT = -1;
export const DEFAULT_PER_PAGE = 10;
export const ASSENDING_SORT = 1
export const INIT_PER_PAGE = 25;
export const DEFAULT_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: DEFAULT_SORT_BY,
    sort: DEFAULT_SORT,
    // search: ""
};
export const DEFAULT_ADV_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: DEFAULT_SORT_BY,
    sort: DEFAULT_SORT,
    // search: "",
    filter: {}
};

export const DELETE_REQ_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: DEFAULT_UPDATE_AT,
    sort: DEFAULT_SORT,
    // search: "",
    filter: {}
};

export const DEFAULT_RELIGION_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: DEFAULT_UPDATE_AT,
    sort: DEFAULT_SORT,
    filter: {}
};

export const DEFAULT_ASYNC_MASTER_FILTER = {
    skip: 0,
    limit: INIT_PER_PAGE,
    sortBy: DEFAULT_SORT_BY,
    sort: DEFAULT_SORT,
    filter: {}
}

export const MSG = {
    RECORD_ADDED_SUCC: "Record added Successfully",
    RECORD_UPDATED_SUCC: "Record updated Successfully",
    RECORD_DELETED_SUCC: "Record deleted Successfully",
    INVALID_NAME: "Name can only contain letters",
    MIN_CHAR: "Minimum 3 characters required",
    MAX_CHAR: "Maximum 25 character allowed",
    MAX_CHAR_FOR_PROFILE_NAME: "Maximum 30 character allowed",
};

export const isShowFrontPage = [
    {
        label: "Yes",
        value: true
    },
    {
        label: "No",
        value: false
    }
]

export const DEFAULT_OLD_SITE_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: DEFAULT_SORT_BY,
    sort: DEFAULT_SORT,
};

export const DEFAULT_ASYNC_LANG_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: "orderList",
    sort: 1,
};

export const DEFAULT_ADVANCE_ASYNC_LANG_FILTER = {
    skip: 0,
    limit: DEFAULT_PER_PAGE,
    sortBy: "orderList",
    sort: 1,
    filter: {}
};

export const NAME_REGEX = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi;
export const PHONE_IND_REGEX = /^[6-9]\d{9}$/