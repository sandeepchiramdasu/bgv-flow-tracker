import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCandidates,
} from "./candidateSlice";

import type { AppDispatch, RootState } from "../../app/store";
import type { Candidate } from "../../types";

import CandidateCard from "./CandidateCard";
import CreateCandidateModal from "./CreateCandidateModal";
import MainLayout from "../../layouts/MainLayout";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { verifyCandidate } from "../verification/verificationAPI";

type Status =
  | "identity_check"
  | "employment_check"
  | "final_report";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading } = useSelector(
    (state: RootState) => state.candidates
  );

  const role = useSelector(
    (state: RootState) => state.auth.role
  );

  const [showModal, setShowModal] = useState(false);

  // ✅ SEARCH
  const [search, setSearch] = useState("");

  // ✅ TAT FILTER
  const [tatFilter, setTatFilter] =
    useState<string>("all");

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  // ✅ FILTERED LIST
  const filteredList = list.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesTat =
      tatFilter === "all" ||
      c.tat_status === tatFilter;

    return matchesSearch && matchesTat;
  });

  // ✅ GROUPED
  const grouped: Record<Status, Candidate[]> = {
    identity_check: [],
    employment_check: [],
    final_report: [],
  };

  filteredList.forEach((c) => {
    grouped[c.status].push(c);
  });

  // ✅ DRAG LOGIC
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const source = result.source.droppableId;
    const destination = result.destination.droppableId;

    if (source === destination) return;

    const candidateId = Number(result.draggableId);

    // ❌ Prevent backward movement
    if (destination === "identity_check") {
      return;
    }

    try {
      // identity → employment
      if (destination === "employment_check") {
        await verifyCandidate(candidateId, {
          identity_verified: true,
        });
      }

      // employment → final
      if (destination === "final_report") {
        await verifyCandidate(candidateId, {
          employment_verified: true,
        });
      }

      dispatch(fetchCandidates());
    } catch (error) {
      console.error("Drag verification failed", error);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-3xl font-bold text-gray-800">
            Candidate Workflow
          </h2>

          <div className="flex flex-col md:flex-row gap-3">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search candidate..."
              className="border border-gray-300 p-2 rounded-lg w-64 bg-white"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {/* ✅ TAT FILTER */}
            <select
              value={tatFilter}
              onChange={(e) =>
                setTatFilter(e.target.value)
              }
              className="border border-gray-300 p-2 rounded-lg bg-white"
            >
              <option value="all">All TAT</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
            </select>

            {/* CREATE BUTTON */}
            {role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                + Add Candidate
              </button>
            )}

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredList.length === 0 && (
          <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-400">
            No candidates found
          </div>
        )}

        {/* KANBAN */}
        {!loading && filteredList.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {Object.entries(grouped).map(
                ([status, items]) => (
                  <Droppable
                    droppableId={status}
                    key={status}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-white p-5 rounded-2xl shadow border border-gray-200 min-h-[500px]"
                      >

                        {/* COLUMN HEADER */}
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="font-semibold text-gray-700 capitalize">
                            {status.replace("_", " ")}
                          </h3>

                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {items.length}
                          </span>
                        </div>

                        {/* CARDS */}
                        <div className="flex flex-col gap-4">

                          {items.map((c, index) => (
                            <Draggable
                              key={c.id}
                              draggableId={String(c.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <CandidateCard data={c} />
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}

                        </div>
                      </div>
                    )}
                  </Droppable>
                )
              )}

            </div>
          </DragDropContext>
        )}

        {/* MODAL */}
        {showModal && (
          <CreateCandidateModal
            onClose={() => setShowModal(false)}
          />
        )}

      </div>
    </MainLayout>
  );
}