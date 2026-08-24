import { AdvancedFilterTypes, Entitytyping } from '../generated-types/type-defs';
import { DataSources } from '../types';

export interface JobPollResult {
  hasJob: boolean;
  jobId: string | null;
  status: string | null;
}

export const resolveJobStatusForEntity = async (
  dataSources: DataSources,
  id: string,
): Promise<JobPollResult> => {
  const { results } = await dataSources.CollectionAPI.GetAdvancedEntities(
    Entitytyping.Job,
    1,
    1,
    [
      { type: AdvancedFilterTypes.Type, value: 'job' },
      {
        type: AdvancedFilterTypes.Selection,
        key: 'relations.isJobFor.key',
        value: id,
        match_exact: true,
      },
    ],
    { value: '' },
  );

  const job = results?.[0];
  if (!job) {
    return { hasJob: false, jobId: null, status: null };
  }

  const { status } = await dataSources.CollectionAPI.GetJobStatus(job.id);
  return { hasJob: true, jobId: job.id, status };
};
