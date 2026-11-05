import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Sparkles,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Award,
  CheckCircle2,
  Plus,
  Send,
  Download,
} from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { CampusEvent, Club, CommunityPost } from '../../types';

export const CampusLifePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'clubs' | 'community' | 'achievements'>('events');
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // Post creation modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCommunity, setPostCommunity] = useState('Campus Tech Community');

  useEffect(() => {
    dataService.getEvents().then(setEvents);
    dataService.getClubs().then(setClubs);
    dataService.getCommunityPosts().then(setPosts);
  }, []);

  const handleRegisterEvent = async (eventId: string) => {
    await dataService.registerEvent(eventId);
    setEvents(await dataService.getEvents());
    alert('Successfully registered for event! Access badge generated.');
  };

  const handleToggleClub = async (clubId: string) => {
    await dataService.toggleJoinClub(clubId);
    setClubs(await dataService.getClubs());
  };

  const handleLikePost = async (postId: string) => {
    await dataService.toggleLikePost(postId);
    setPosts(await dataService.getCommunityPosts());
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent) return;
    await dataService.createCommunityPost({
      community_name: postCommunity,
      author_name: user?.full_name || 'Aarav Sharma',
      author_role: user?.role === 'student' ? 'Student' : 'Faculty',
      title: postTitle,
      content: postContent,
    });
    setPosts(await dataService.getCommunityPosts());
    setIsPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus Life & Communities
            </h1>
            <Badge variant="brand">Student Hub</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Flagship hackathons, technical clubs, peer discussions, and student achievements
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsPostModalOpen(true)}
        >
          Create Community Post
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'events', label: 'Flagship Events', count: events.length },
          { id: 'clubs', label: 'Student Clubs & Societies', count: clubs.length },
          { id: 'community', label: 'Communities Feed', count: posts.length },
          { id: 'achievements', label: 'Portfolio & Awards', count: 2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card key={ev.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="brand">{ev.category}</Badge>
                  {ev.registered ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Capacity: {ev.capacity}</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3">{ev.description}</p>
                <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  Venue: {ev.venue}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {ev.registered ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => alert(`Downloading Registration Pass for ${ev.title}`)}
                  >
                    Pass & QR
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRegisterEvent(ev.id)}
                  >
                    Register Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Clubs */}
      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clubs.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{c.category}</Badge>
                  <span className="text-xs font-semibold text-slate-500">{c.member_count} members</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                <div className="mt-3 text-[11px] text-slate-400">
                  Faculty Lead: {c.lead_name || 'Faculty Mentor'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant={c.is_member ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleClub(c.id)}
                >
                  {c.is_member ? 'Joined (Member)' : 'Join Club'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Community Feed */}
      {activeTab === 'community' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {posts.map((post) => (
            <Card key={post.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {post.community_name}
                  </span>
                  <div className="text-[11px] text-slate-400">
                    Posted by <span className="font-semibold text-slate-700 dark:text-slate-300">{post.author_name}</span> ({post.author_role})
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>

              {post.title && (
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {post.title}
                </h3>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition ${
                    post.liked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-rose-600' : ''}`} />
                  <span>{post.likes_count} Likes</span>
                </button>
                <button
                  onClick={() => alert('Comments enabled in live realtime Supabase channel.')}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Achievements */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="brand">Hackathon</Badge>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  First Runner Up - National Smart India Hackathon
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issued by Ministry of Education, Govt. of India (Dec 2025)
                </p>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => alert('Certificate PDF downloaded')}
              >
                View Certificate
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="brand">Cloud Certification</Badge>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  AWS Certified Solutions Architect - Associate
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issued by Amazon Web Services (Oct 2025)
                </p>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => alert('AWS Certificate verified on AWS Credential Engine')}
              >
                View Credential
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Share with Campus Community"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Community
            </label>
            <select
              value={postCommunity}
              onChange={(e) => setPostCommunity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Campus Tech Community">Campus Tech Community</option>
              <option value="Career & Placement Discussions">Career & Placement Discussions</option>
              <option value="Cultural & Arts Circle">Cultural & Arts Circle</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Post Title
            </label>
            <input
              type="text"
              placeholder="e.g. Hackathon Team Formation / Project Demo"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discussion Content
            </label>
            <textarea
              rows={4}
              required
              placeholder="What would you like to discuss with fellow students and faculty?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
