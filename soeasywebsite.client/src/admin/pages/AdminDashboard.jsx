import StatCard from "../components/StatCard";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">

      <div className="dashboard-welcome">
        <h2>Welcome back 👋</h2>

        <p>
          Here's what's happening with your matrimony bureau today.
        </p>
      </div>


      <div className="dashboard-stats">

        <StatCard
          title="Total Profiles"
          value="156"
          subtitle="Active profiles"
          icon="👥"
        />

        <StatCard
          title="Male Profiles"
          value="72"
          subtitle="Registered grooms"
          icon="♂"
        />

        <StatCard
          title="Female Profiles"
          value="84"
          subtitle="Registered brides"
          icon="♀"
        />

        <StatCard
          title="Active Members"
          value="12"
          subtitle="Paid memberships"
          icon="◆"
        />

        <StatCard
          title="Pending Payments"
          value="8"
          subtitle="Need verification"
          icon="₹"
        />

        <StatCard
          title="Pending Reports"
          value="5"
          subtitle="Need review"
          icon="!"
        />

      </div>


      <div className="dashboard-grid">

        <section className="dashboard-panel">

          <div className="panel-header">
            <h3>Recent Activity</h3>

            <button>
              View All
            </button>
          </div>

          <div className="activity-list">

            <div className="activity-item">
              <div className="activity-icon">
                ₹
              </div>

              <div>
                <strong>
                  New membership request
                </strong>

                <span>
                  Rahul Nair submitted a payment reference
                </span>
              </div>

              <small>
                10 min ago
              </small>
            </div>


            <div className="activity-item">

              <div className="activity-icon">
                !
              </div>

              <div>
                <strong>
                  Profile reported
                </strong>

                <span>
                  A profile was reported as already married
                </span>
              </div>

              <small>
                35 min ago
              </small>

            </div>


            <div className="activity-item">

              <div className="activity-icon">
                +
              </div>

              <div>
                <strong>
                  New profile registered
                </strong>

                <span>
                  A new member joined Soesy
                </span>
              </div>

              <small>
                1 hr ago
              </small>

            </div>

          </div>

        </section>


        <section className="dashboard-panel">

          <div className="panel-header">
            <h3>Quick Actions</h3>
          </div>

          <div className="quick-actions">

            <button>
              Review Payments
            </button>

            <button>
              View Reports
            </button>

            <button>
              Manage Profiles
            </button>

            <button>
              View Leads
            </button>

          </div>

        </section>

      </div>

    </div>
  );
};

export default AdminDashboard;