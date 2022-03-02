import React from "react";
import { ColumnDefinition, Utils, Queu } from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { Ticker } from "./components/Ticker";

const PLUGIN_NAME = "QueuesStatsMetricStylingPlugin";

export default class QueuesStatsMetricStylingPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.customizeAggregateTiles(flex);
    this.customizeQueuesDataTable(flex);
  }

  customizeAggregateTiles(flex) {
    // TODO. Higher complexity than the queue columns :) 
    
    // // Remove original tiles
    // flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove("waiting-tasks-tile");
    // flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove("longest-wait-time-tile");

    // flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    // );
  
  }

  customizeQueuesDataTable(flex) {
    // Remove the original columns
    flex.QueuesStats.QueuesDataTable.Content.remove("waiting-tasks");
    flex.QueuesStats.QueuesDataTable.Content.remove("longest-wait-time");

    // Create a new "Waiting" column with custom formatting
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
        key="my-waiting-tasks"
        header="Waiting"
        content={(queue) => {
          // Calculate number of waiting tasks by adding pending and reserved
          const { pending, reserved } = queue.tasks_by_status;
          const waitingTasks = pending + reserved;

          // Set the style to color: red if # of waiting tasks is > 0
          const spanStyle =
            waitingTasks > 0 ? { color: "red", fontWeight: "bold" } : {};

          // Return the element to render
          return <span style={spanStyle}>{waitingTasks}</span>;
        }}
      />,
      { sortOrder: 1 } // Put this after the second column
    );

    // Create a new "Longest Wait Time" column with custom formatting
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
        key="my-longest-wait-time"
        header="Longest"
        content={(queue) => {
          
          // Return the element to render
          return this.renderLongestWaitingTimeTicker(queue);
        }}
      />,
      { sortOrder: 2 } // Put this after the third column
    );
  }

  renderLongestWaitingTimeTicker(queue) {
    const timestamp = queue.longest_task_waiting_from;

    const ticker = (
      <Ticker>
        {() => {
          // Set the style to color: red if duration is more than 5 secs
          const spanStyle =
            this.getDurationFromTimestamp(timestamp) > 5000 ? { color: "red", fontWeight: "bold" } : {};
          return <span style={spanStyle}>{Utils.formatTimeDuration(this.getDurationFromTimestamp(timestamp), "short")}</span>
        }}
      </Ticker>
    );
    return ticker;
  }

  getDurationFromTimestamp(timestamp) {
    const duration = timestamp
      ? Date.now() - new Date(timestamp).getTime()
      : 0;

      return duration;
  }
}
