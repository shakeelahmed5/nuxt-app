import { type TrackerDate } from '@/types/tracker';

export const useTracker = () => {

  const sanctumFetch = useSanctumClient();
  const request = useState('trackerRequest', () => false);
  const toast = useToast();
  
  const prepareSaveData = (trackers: TrackerDate[], date: string) => {
    let data = {
      date: date,
      trackers: {},
    };
  
    data.trackers = trackers.map(function (tracker: TrackerDate) {
      return {
        id: tracker.id,
        count: tracker.points.unit_qty,
      };
    });
  
    return data;
  }

  const minus = (tracker: TrackerDate) => {
    if (tracker.points.unit_qty === 0) {
      tracker.points.unit_qty = 0;

      return;
    }

    tracker.points.unit_qty -= 1 * tracker.increments;

    tracker.points.total_points -= 1 * tracker.point_value * tracker.increments;
  }

  const plus = (tracker: TrackerDate) => {
    if (tracker.points.unit_qty >= tracker.max_count) {
      tracker.points.unit_qty = tracker.max_count;

      return;
    }

    tracker.points.unit_qty += 1 * tracker.increments;

    tracker.points.total_points += 1 * tracker.point_value * tracker.increments;
  }

  const save = async(trackers: TrackerDate[], date: string) => {
    request.value = true;
  
    try {
      await sanctumFetch("/api/trackers/date", {
        method: "POST",
        body: prepareSaveData(trackers, date),
      });
  
      toast.add({
        icon: "i-heroicons-check-circle",
        title: "Success!",
        description: "Your Daily Dozen was saved successfully.",
        color: "green",
      });
    } catch (error) {
      console.error(error);
  
      // const err = useSanctumError(error);
      // console.log("err:  ", err);
  
      // if (err.isValidationError) {
      //   //   form.value?.setErrors(err.bag);
      //   console.log("error is Validation error");
      // }
  
      toast.add({
        icon: "i-heroicons-exclamation-circle",
        title: "Error!",
        description: "There was a problem saving your Daily Dozen.",
        color: "red",
      });
    } finally {
      request.value = false;
    }
  }

  return {
    minus,
    plus,
    save,
    request
  };
};
