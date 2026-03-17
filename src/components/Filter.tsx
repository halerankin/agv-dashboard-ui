import type { GlobalFilter, GlobalSort } from '../types';

type FilterProps = {
	filter: GlobalFilter,
	sort: GlobalSort,
	paused: boolean, 
	onFilterChange: (value: GlobalFilter) => void,
	onSortChange: (value: GlobalSort) => void,
	onPausedToggle: () => void
}

export default function Filter({
	filter,
	sort,
	paused,
	onFilterChange,
	onSortChange,
	onPausedToggle
}: FilterProps)
{
	return (
		<div className="toolbar">
			<div className="toolbar__group">
				<label className="toolbar__label" htmlFor="filterSelect">
				Filter
				</label>
				<select
				className="btn-base toolbar__select"
				name="filter"
				id="filterSelect"
				value={filter}
				onChange={(event) => onFilterChange(event.target.value as GlobalFilter)}
				>
				<option value="all">All</option>
				<option value="hasAlerts">Has alerts</option>
				<option value="badComms">Bad comms</option>
				</select>
			</div>

			<div className="toolbar__group">
				<label className="toolbar__label" htmlFor="sortSelect">
				Sort
				</label>
				<select
				className="btn-base toolbar__select"
				name="sort"
				id="sortSelect"
				value={sort}
				onChange={(event) => onSortChange(event.target.value as GlobalSort)}
				>
				<option value="name">Name</option>
				<option value="severity">Severity</option>
				<option value="lastUpdate">Last update</option>
				</select>
			</div>

			<div className="toolbar__actions">
				<button
				type="button"
				className="btn-base toolbar__button"
				onClick={onPausedToggle}
				>
				{paused ? 'Resume' : 'Pause'}
				</button>
			</div>
			</div>
	)
}