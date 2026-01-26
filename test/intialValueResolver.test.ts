import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {Entity} from "../../../generated-types/type-defs";
import {
    resolveIntialValueParentRoot,
    resolveIntialValueParentMetadata,
    resolveIntialValueParentRelations
} from "../resolvers/intialValueResolver";
import {DataSources} from "../types";


const mockEntity = (id: string, type: string, metadata = [], relations= []): Entity => ({
    id: id,
    type: type,
    metadata: metadata,
    relations: relations,
    schema: {},
    _id: id,
    identifiers: [],
    audit: {},
    document_version: 1,
    uuid: id
});

const mockDataSource = {
    CollectionAPI: {
        getEntityById: vi.fn()
    }
};

describe('IntialValueResolver', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should return correct root data from parent 1 relation away', async () => {
        const child = mockEntity("1", "expression", [], [{"key": "2", "type": "refWork"}]);
        const parent = mockEntity("2", "work");
        mockDataSource.CollectionAPI.getEntityById.mockResolvedValueOnce(parent);

        const result = await resolveIntialValueParentRoot(
            mockDataSource as unknown as DataSources,
            child,
            "type",
            ["refWork"]
        );

        expect(mockDataSource.CollectionAPI.getEntityById).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(parent["type"]);
    });

    it('Should return correct metadata from parent 1 relation away', async () => {
        const child = mockEntity('1',"expression", [], [{"key": "2", "type": "refWork"}]);
        const parent = mockEntity(
            "2",
            "work",
            [
                { "key": "test1", "value": "test" },
                { "key": "actual_metadata", "value": "should_get_returned" },
                { "key": "test2", "value": "test" }
            ],
            []
        )
        mockDataSource.CollectionAPI.getEntityById.mockResolvedValueOnce(parent);

        const result = await resolveIntialValueParentMetadata(
            mockDataSource as unknown as DataSources,
            child,
            "actual_metadata",
            ["refWork"]
        );

        expect(mockDataSource.CollectionAPI.getEntityById).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual("should_get_returned");
    });

    it('Should return correct relations from parent 2 relations away', async () => {
        const child = mockEntity('1',"manifestation", [], [{"key": "2", "type": "refExpressions"}]);
        const parent = mockEntity('2',"expression", [], [{"key": "3", "type": "refWork"}]);
        const superParent = mockEntity('3',"work", [], [
            {"key": "789", "type": "refAuthor"},
            {"key": "456", "type": "refAuthor"},
        ]);
        mockDataSource.CollectionAPI.getEntityById
            .mockResolvedValueOnce(parent)
            .mockResolvedValueOnce(superParent);

        const result = await resolveIntialValueParentRelations(
            mockDataSource as unknown as DataSources,
            child,
            "refAuthor",
            ["refExpressions", "refWork"]
        );

        expect(mockDataSource.CollectionAPI.getEntityById).toHaveBeenCalledTimes(2);
        expect(result).toStrictEqual(['789', '456']);
    });
});
